import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
    name: 'notification',
    initialState: '',
    reducers: {
        createNotification(state, action) {
            return action.payload
        },
        resetNotification(state, action) {
            return ''
        }
    }
})

export const setNotification = (message, time) => {
    return async dispatch => {
        dispatch(createNotification(message))
        setTimeout(() => {
            dispatch(resetNotification())
        }, time * 1000)
    }
}

export const { createNotification, resetNotification } = notificationSlice.actions
export default notificationSlice.reducer