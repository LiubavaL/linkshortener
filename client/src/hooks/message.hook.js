import {useCallback} from 'react'

export const useMessage = () => {
    return useCallback(text => {
        console.log('useMessage')
        console.log('text', text)
        if(window.M && text) {
            console.log('useCallback')
            window.M.toast({html: text})
        }
    }, [])
}