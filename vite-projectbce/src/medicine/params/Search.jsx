import React from "react";
import { useSearchParams } from "react-router-dom";
function Search(){
    const [params]=useSearchParams();
   
    return(
        <div>
            <h1> Use Search params</h1>
            <p>{params.get("name")}</p>
            <p>{params.get("mobile")}</p>
        </div>  
    )
}

export default Search;