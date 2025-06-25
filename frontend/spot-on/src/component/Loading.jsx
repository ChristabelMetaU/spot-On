import { use } from "react"
import {useAuth} from "./AuthContext"
const Loading = () => {
    const { loading } = useAuth()
    return (
        <div className="loading">
            {loading && <h1>Loading </h1>}
        </div>
    )
}
export default Loading;
