import React, { useState } from 'react'
import { ListItem, TextField, Grid } from '@material-ui/core';
import { DeleteOutlineOutlined, EditOutlined } from '@material-ui/icons';

import styles from './TaskItem.module.css';
import { db } from './firebase/config';
import { PROPS } from './types';

const TaskItem: React.FC<PROPS> = (props) => {
    const [ title, setTitle ] = useState(props.title)

    const editTask = () => {
        db.collection("tasks").doc(props.id).set({ title: title }, { merge: true })
    }

    const deleteTask = () => {
        db.collection("tasks").doc(props.id).delete()
    }

    return (
        <ListItem>
            <h2>{props.title}</h2>
            <Grid container justify="flex-end">
                <TextField
                    label="Edit Task" value={title} InputLabelProps={{ shrink: true }}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        setTitle(e.target.value)
                    }}
                />
            </Grid>
            <button className={styles.taskItem__icon} onClick={editTask}>
                <EditOutlined />
            </button>
            <button className={styles.taskItem__icon} onClick={deleteTask}>
                <DeleteOutlineOutlined />
            </button>
        </ListItem>
    )
}

export default TaskItem
