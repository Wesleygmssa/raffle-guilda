/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {mask, unMask} from 'remask';
import queryString from 'query-string';
import {useLocation} from 'react-router-dom' ;
import {toast} from 'react-toastify';
import { Cube } from 'styled-loaders-react'
import 'react-toastify/dist/ReactToastify.css';

import api from '../../services/api';

import logo from '../../assets/logo.png';
import iconData from '../../assets/calendario.png';
import iconHora from '../../assets/relogio.png';

import './styles.css';

toast.configure();
function Form() {
  const [loading, setLoading] = useState(true);
  /**
   * Estado do componente que vai receber o input username
   */
  const [username, setUsername] = useState('');
  /**
   * Estado do componente que vai receber o input phone
   */
  const [phone, setPhone] = useState('');

  const location = useLocation();
  const [raffle, ] = useState(queryString.parse(location.search).p_);
  const [activeRaffle, setActiveRaffle] = useState(false);
  const [dateRaffle, setDateRaflle] = useState('');
  const [hourRaffle, setHourRaflle] = useState('');
  const [nameRaffle, setNameRaffle] = useState('');
  const [notFound, setNotFound] = useState('');

  useEffect(() => {
    async function loadRaffle() {  
      if (!raffle) {
        setLoading(false);
        setNotFound('Sorteio não encontrado.');
        return toast.error('Sorteio não encontrado.');
      }
      /**
       * configura o corpo da requisição
       */
      const requestBody = {
        token: 'BJBWGUBbfebfe314FBEUBFE',
        srt_id: raffle,
      };
  
       /**
       * configura o cabeçalho da requisição
       */
  
      const config = {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      };
  
      /**
       * faz a requisição com o corpo serializado
       */
      
      const { data } = await api.post('/sorteio/list/', queryString.stringify(requestBody), config);

      if (!data.sorteios) {
        setLoading(false);
        setActiveRaffle(false);
        setNotFound('Sorteio não encontrado.');
        return toast.error('Sorteio não encontrado.');
      }

      const getRaffle = data.sorteios;

      const getRaffleStatus = getRaffle.map((raffle) => raffle.srt_status);

      if (getRaffleStatus.includes("F")) {
        setLoading(false);
        setActiveRaffle(false);
        setNotFound('Sorteio indisponível.');
        return toast.error('Sorteio indisponível.');
      }

      setActiveRaffle(true);

      const getRaffleName = getRaffle.map((raffle) => raffle.srt_nome);
      const getRaffleDate = getRaffle.map((raffle) => raffle.srt_data_inicio);
      const getRaffleHour = getRaffle.map((raffle) => raffle.srt_hora_inicio);

      if (!getRaffleName) {
        setNameRaffle("A definir")
      }

      if (!getRaffleDate) {
        setDateRaflle("A definir")
      }

      if (!getRaffleHour) {
        setDateRaflle("A definir")
      }
      setLoading(false);
      setNameRaffle(getRaffleName);  
      setDateRaflle(getRaffleDate);     
      setHourRaflle(getRaffleHour);
      
    }
  
      loadRaffle();
  }, [raffle])


  /**
   * Função que vai aplicar a máscara no telefone
   * 1 - original value : garante que o número está sem máscara
   * 2 - maskedPhone : aplica a máscara com o DD + 9 dígitos
   * 3 - setPhone : insere telefone com máscara no estado
   */
  function onChangePhone(event) {
    const originalValue = unMask(event.target.value);
    const maskedPhone = mask(originalValue, ['(99) 9999-9999']);
    setPhone(maskedPhone)
  }

  /**
   * Função que vai fazer a requisição e devolver o hash do sorteio
   * 1 - verfica se os campos foram preenchidos
   * 2 - 
   */

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);

    if (!raffle) {
      setLoading(false);
      return toast.error('Digite o parâmetro do sorteio');
    }

    if (!username) {
      setLoading(false);
      return toast.error('Digite seu usuário');
    }
    if (!phone) {
      setLoading(false);
      return toast.error('Digite seu telefone');
    }
    const originalValuePhone = unMask(phone);
     /**
      * FAZ CADASTRO DO USUÁRIO
      */

      /**
         * configura o corpo da requisição
         */
        const requestBody = {
          token: 'BJBWGUBbfebfe314FBEUBFE',
          usr_nome: username,
          usr_nickname: username,
          usr_telefone: originalValuePhone,
          usr_password: 'WEB SORTEIO',
          usr_tipo: 'W'
        };
    
        /**
         * configura o cabeçalho da requisição
         */
    
        const config = {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        };
    
        /**
         * faz a requisição com o corpo serializado
         */
        
        await api.post('/user', queryString.stringify(requestBody), config);

        /*if (data.message !== "Success") {
          setLoading(false);
          return toast.error('Usuário já cadastrado.');
        }*/

       /**
      * RETORNA O USUÁRIO CADASTRADO
      */

        /**
         * configura o corpo da requisição
         */
        const bodyRequest = {
          token: 'BJBWGUBbfebfe314FBEUBFE',
          usr_nickname: username,
        };
    
        /**
         * faz a requisição com o corpo serializado
         */
        
        const response = await api.post('/user/list', queryString.stringify(bodyRequest), config);

        if(!response.data.users) {
          setLoading(false);
          setNotFound('Usuário não encontrado.');
          return toast.error('Usuário não encontrado.');
        }

      const getUser =  response.data.users; // guarda o array do usuário que esta sendo cadastrado

       /**
      * VERIFICA SE É UM USUÁRIO M
      * o includes retorna true se o valor passado existir no array
      */

        const mapUserM = getUser.map((user) => user.usr_tipo); // faz outro array so com o campo tipo do usuário

        if (mapUserM.includes("M")) {
          setLoading(false);
          setActiveRaffle(false);
          setNotFound('Acesse o aplicativo para participar do sorteio.');
          return toast.success('Acesse o aplicativo para participar do sorteio.');
        }

       /**
      * PEGA ID USUÁRIO
      */

      const mapGetIdUser = getUser.map((user) => user.usr_id); // faz outro array so com o campo id do usuário

       /**
      * VERIFICAR SE USUÁRIO JÁ ESTÁ PARTICIPANDO DO SORTEIO
      */

       /**
         * configura o corpo da requisição
         */
        const body = {
          token: 'BJBWGUBbfebfe314FBEUBFE',
          stp_sorteio: raffle,
        };
    
        /**
         * faz a requisição com o corpo serializado
         */
        
        const res = await api.post('/sorteioparticipante/list', queryString.stringify(body), config);

        if(res.data.sorteio_participantes_users) {

          const findUsersRaffler = res.data.sorteio_participantes_users; // guarda o array de todos os participantes
        
          const mapUsersRaffler = findUsersRaffler.map((user) => user.usr_id); // faz outro array so com o id dos participantes

          /**
           * verifica se o id do usuário cadastrado existe no array de participantes
           */
          if (mapUsersRaffler.includes(mapGetIdUser[0])) {
            setActiveRaffle(false);
            setLoading(false);
            setNotFound('Você já está participando desse sorteio.');
            return toast.error('Você já está participando desse sorteio.');
          }
        }        

      /**
       * INSERIR USUÁRIO NO SORTEIO
       */
        /**
         * configura o corpo da requisição
         */
        const Reqbody = {
          token: 'BJBWGUBbfebfe314FBEUBFE',
          stp_sorteio: raffle,
          stp_user: mapGetIdUser,
        };
    
        /**
         * faz a requisição com o corpo serializado
         */
        
        const answer = await api.post('/sorteioparticipante', queryString.stringify(Reqbody), config);

        if (answer.data.message === "Success") {
          setActiveRaffle(false);
          setLoading(false);
          return toast.success('Sucesso ao participar do sorteio.');
        }
  }

  return (
    <div className="container">
      <div className="content">
        {loading ? <Cube color="#FFF"/> : (
          <>
            <img src={logo} alt="Logo"/>
            <h1 className="title">{`${notFound ? notFound : 'Sorteio'}`}</h1>
    
            <div className={`data-hour ${activeRaffle ? '' : 'hidden'}`}>
              <div className="name">
                <p>{nameRaffle}</p>
              </div>

              <div className="date-hour">
                <img src={iconData} alt="Data"/>
                <p className="date">{dateRaffle}</p>

                <img src={iconHora} alt="Hora"/>
                <p>{hourRaffle}</p>
              </div>
            </div>
            
    
            <form onSubmit={handleSubmit}>
              <div className={`${activeRaffle ? '' : 'hidden'}`}>
              <input
                value={username}
                onChange={event => setUsername(event.target.value)} 
                placeholder="Username (seu nome no jogo)"
              />
          
              <input
                value={phone}
                onChange={onChangePhone}  
                placeholder="Telefone (mesmo número do whatsapp)"
              />
    
              <button className="button" type="submit">Participar do Sorteio</button>
              </div>          
            </form>
          </>
        )}
      
      </div>
    </div>
    
  )
}

export default Form;