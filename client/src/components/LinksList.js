import React from 'react'
import {Link} from 'react-router-dom'

export const LinksList = ({links}) => {
    if(!links.length){
        return <p>No generated links yet.</p>
    }
    return (
        <table>
            <thead>
                <tr>
                    <th>N</th>
                    <th>Original</th>
                    <th>Short</th>
                    <th>Action</th>
                </tr>
            </thead>

            <tbody>
                {links.map(
                    (link, index) => 
                         (
                            <tr key={link._id}>
                                <td>{index}</td>
                                <td>{link.from}</td>
                                <td>{link.to}</td>
                                <td><Link to={`/detail/${link._id}`}>Open</Link></td>
                            </tr>
                        )
                    )
                }
            </tbody>
        </table>
    )
}