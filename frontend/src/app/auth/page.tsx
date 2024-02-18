import React from 'react'
import { authenticate } from '@/app/lib/actions'

export default function Auth() {
    return (
        <form action={authenticate}>
            <input type="text" name="login" />
            <input type="password" name="password" />
            <input type="submit" value="login" />
        </form>
    )
}
