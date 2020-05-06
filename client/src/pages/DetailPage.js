import React, { useState, useCallback, useContext, useEffect } from 'react'
import {useParams} from 'react-router-dom'
import { useHttp } from '../hooks/http.hook'
import { AuthContext } from '../context/AuthContext'
import {LinkCard} from '../components/LinkCard'
import {Loader} from '../components/Loader'

export const DetailPage = () => {
    const [link, setLink] = useState(null)
    const linkId = useParams().id
    const {request, loading} = useHttp()
    const {token} = useContext(AuthContext)

    const getLink = useCallback(async () => {
        try {
            const fetched = await request(`/api/link/${linkId}`, 'GET', null, {Authorization: `Bearer ${token}`})
            setLink(fetched)
        }catch (e) {
        }
    }, [token, linkId, request])

    useEffect(() => {
        getLink()
    }, [getLink])

    if (loading) return <Loader />;

    return (
        <div className="detail_page">
            {!loading && link && <LinkCard link={link}/>}
        </div>
    )
}