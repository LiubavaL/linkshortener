import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Loader } from '../components/Loader'
import {AuthContext} from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'
import { LinksList } from '../components/LinksList'

export const LinksPage = () => {
    const [links, setLinks] = useState([])
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()

    const getLinks = useCallback(async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {Authorization: `Bearer: ${token}`})
            setLinks(fetched)
        } catch (e){}
    }, [request, token])

    useEffect(() => {
        getLinks()
    }, [getLinks])

    if(loading) return <Loader />

    return (
        <div className="links">
            {!loading && links && <LinksList links={links}/>}
        </div>
    )
}