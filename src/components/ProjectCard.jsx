import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { Button, CardActionArea, CardActions } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import { db } from '../firebase-configs';
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const ProjectCard = ({ project }) => {
  const user = useSelector((state) => state.user);
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    const unsubscribe = async () => {
      console.log(user.uid);
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      const docData = docSnap.data()
      const isPresent = docData.saved.includes(project.id)
      setIsSaved(isPresent)
    }
    return () => unsubscribe()
  }, [])

  const handleSave = async () => {
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    const docData = docSnap.data()
    if (!isSaved) {
      await updateDoc(userDocRef, {
        ...docData,
        saved: [...docData.saved, project.id]
      })
    }
    else {
      const newSaved = docData.saved.filter((item) => item !== project.id)
      await updateDoc(userDocRef, {
        ...docData,
        saved: newSaved
      })
    }
    setIsSaved(!isSaved)
  }

  return (
    <Card sx={{ maxWidth: 345, height: '100%', position: 'relative' }}>
      <CardMedia
        component="img"
        height="140"
        image={project.projectImagesURLs[0] || '/assets/images.png'}
        alt="Project-image"
        className='object-cover h-[160px]'
      />

      <Link to={`/explore/project/${project.id}`} >
        <CardContent className='relative' sx={{ position: 'relative' }}>
          <Typography gutterBottom variant="h5" component="div">
            {project.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              // height: 60,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 3, // Limit to 3 lines
            }}
          >
            {project.description}
          </Typography>
        </CardContent>
      </Link>
      <CardActions sx={{ position: 'absolute', top: 0, right: 0 }}>
        {/* <Button size="small" sx={{ padding: 0, color: 'black', margin: 0 }}> */}
        <button onClick={handleSave} className='p-[6px] text-3xl flex item-center justify-center rounded-full bg-white'>
          { isSaved ? <BookmarkIcon/> : <BookmarkBorderIcon/>}
        </button>

        {/* </Button> */}
      </CardActions>
    </Card>
  )
}

export default ProjectCard