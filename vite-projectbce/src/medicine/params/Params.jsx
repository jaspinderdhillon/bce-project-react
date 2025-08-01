import { useParams } from "react-router-dom";
function Params(){
    const params=useParams();
    const {name,mobile}=useParams();
    
    return(
        <div>
            <div>
            this is params type 1 
            <br />
            name:{params.name}
            <br />
            mobile:{params.mobile}
            </div>
            <br />
            <div>
            this is params type 2 
            <br />
            name:{name}
            <br />
            mobile:{mobile}
            </div>
        </div>
    )
}
export default Params;