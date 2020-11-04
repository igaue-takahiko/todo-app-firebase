import React, { useEffect, useState } from 'react';
import {
    makeStyles,
    FormControl,
    List,
    TextField,
} from '@material-ui/core';
import { AddToPhotos, ExitToApp } from '@material-ui/icons';

import styles from './App.module.css';
import { db, auth } from './firebase/config';
import TaskItem from './TaskItem';

const useStyles = makeStyles({
        field: {
            marginTop: 30,
            marginBottom: 20,
        },
        list: {
            margin: "auto",
            width: "40%",
        },
});

const App: React.FC = (props: any) => {
    const classes = useStyles()

    const [ tasks, setTasks ] = useState([{ id: "", title: "" }])
    const [ input, setInput ] = useState("")

    const newTask = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        db.collection("tasks").add({ title: input })
        setInput("")
    }

    useEffect(() => {
        const unSub = auth.onAuthStateChanged(user => {
            !user && props.history.push("login")
        })
        return () => unSub()
    })

    useEffect(() => {
        const unSub = db.collection("tasks").onSnapshot(snapshot => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, title: doc.data().title })))
        })
        return () => unSub()
    },[])

    return (
        <div className={styles.app__root}>
            <h1>ToDo List App</h1>
            <button
                className={styles.app__logout}
                onClick={async () => {
                    try {
                        await auth.signOut()
                        props.history.push("login")
                    } catch (error) {
                        alert(error.message)
                    }
                }}
            >
                <ExitToApp />
            </button>
            <br/>
            <FormControl>
                <TextField
                    className={classes.field} label="New Task ?" value={input}
                    InputLabelProps={{ shrink: true }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setInput(e.target.value)
                    }}
                />
            </FormControl>
            <button className={styles.app__icon} disabled={!input} onClick={newTask}>
                <AddToPhotos />
            </button>
            <List className={classes.list}>
                {tasks.map(task => (
                    <TaskItem key={task.id} id={task.id} title={task.title} />
                ))}
            </List>
        </div>
    )
}

export default App;
