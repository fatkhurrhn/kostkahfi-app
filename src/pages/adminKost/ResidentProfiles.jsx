// pages/ResidentProfiles.js
import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
// import { RiSearchLine } from 'remixicon/react';
import { Card, CardContent, CardMedia, TextField, Box, Grid, Typography } from '@mui/material';

export const ResidentProfiles = () => {
  const [residents, setResidents] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    const residentsQuery = query(
      collection(db, 'residents'),
      where('status', '==', 'confirmed')
    );
    const residentsSnapshot = await getDocs(residentsQuery);
    const residentsData = residentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    const roomsSnapshot = await getDocs(collection(db, 'rooms'));
    const roomsData = roomsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    
    setResidents(residentsData);
    setRooms(roomsData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getRoomInfo = (roomId) => {
    const room = rooms.find(r => r.id === roomId);
    return room ? `Gedung ${room.building} - ${room.roomNumber}` : 'Tidak ada kamar';
  };

  const filteredResidents = residents.filter(resident => 
    resident.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Profil Penghuni</h2>
      
      <Box sx={styles.searchContainer}>
        <TextField
          label="Cari nama penghuni"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          fullWidth
          sx={styles.searchInput}
          InputProps={{
            startAdornment: null 
            // <RiSearchLine style={styles.searchIcon} />
            ,
          }}
        />
      </Box>
      
      <Grid container spacing={3} sx={styles.gridContainer}>
        {filteredResidents.map((resident) => (
          <Grid item xs={12} sm={6} md={4} key={resident.id}>
            <Card sx={styles.card}>
              <CardMedia
                component="img"
                height="200"
                image={resident.photoUrl || 'https://via.placeholder.com/200'}
                alt={resident.name}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                  {resident.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>Jenis Kelamin:</strong> {resident.gender}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>Kategori:</strong> {resident.category}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>Asal:</strong> {resident.origin}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>Sejak:</strong> {resident.since}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>Kamar:</strong> {getRoomInfo(resident.roomId)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={styles.detail}>
                  <strong>{resident.occupationType === 'kuliah' ? 'Kampus:' : 'Tempat Kerja:'}</strong> {resident.occupationDetail}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
  },
  title: {
    marginBottom: '2rem',
    color: '#2c3e50',
  },
  searchContainer: {
    marginBottom: '2rem',
    maxWidth: '500px',
  },
  searchInput: {
    width: '100%',
  },
  searchIcon: {
    marginRight: '0.5rem',
    color: '#666',
  },
  gridContainer: {
    marginTop: '1rem',
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s',
    '&:hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    },
  },
  detail: {
    marginBottom: '0.5rem',
  },
};