import React, { useState, useEffect } from 'react';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import { useTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import axios from 'axios';
import {useCookies} from 'react-cookie';

const Notification = () => {

    const theme = useTheme();
    const [invisible, setInvisible] = useState(false);

    const [newNotification, setNewNotification] = useState([]);
	  const [token, setToken] = useCookies(['mytoken']);

    const handleBadgeVisibility = () => {
      if (newNotification.length > 0)
        setInvisible(false);
      else
        setInvisible(true);
    };

    const updateNotification = async () => {
      
      await axios.put('http://127.0.0.1:8000/webapp/notification/', newNotification, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token['mytoken']
        }
      })
      .then(response => {
        console.log('response', response)
      })
      .catch(error => {
        console.log(error)
      });
    };

    const fetchNewNotification = async () => {
      await axios.get('http://127.0.0.1:8000/webapp/new-notification', {
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Token ' + token['mytoken']
        },
      })
        .then(response => {
          var data = response.data
          setNewNotification(data)
        })
        .catch(error => console.log(error));
    };

    useEffect(() => {
      fetchNewNotification()

      //fetch new notifications every 1 hour
      let interval = setInterval( async () => {
        await fetchNewNotification();
      }, 60000);
      return () => {
        clearInterval(interval);
      };

    }, []);
  
    useEffect(() => {
      console.log('newNotification', newNotification)
      handleBadgeVisibility()
    }, [newNotification]);

    return(
      <>
        <Badge badgeContent={newNotification.length > 0 ? newNotification.length : 0} color='secondary' invisible={invisible}
         sx={{
          "& .MuiBadge-badge": {
            right: 10,
            top: -6,
            border: `2px solid ${theme.palette.background.paper}`,
            padding: "0 4px",
            color: theme.palette.background.paper,
            backgroundColor: theme.palette.primary.main
          }
        }}
        >
          <NotificationsActive
            onClick={event => {
              updateNotification()
              fetchNewNotification()
              window.location.href='notification'
            }}
            sx=
            {{
              color: theme.palette.text.primary,
              fontSize:'30px',
              textTransform: 'uppercase',
              mx: 1.5,
              marginLeft: '15px',
              '&:active': {
                color: theme.palette.primary.main,
              },
              '&:hover': {
                color: theme.palette.primary.main,
              },
            }}
          />
        </Badge>
      </>
    );
};
export default Notification;