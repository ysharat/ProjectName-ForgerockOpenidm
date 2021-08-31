import org.forgerock.json.resource.QueryRequest


if(request instanceof QueryRequest){
if(request.queryId == "getSession"){
return [
      [ 
          session:context.parent.parent.parent.headers.Cookie
      ]
    ]
    }
}
 else {
 return [message:"Action Not Supported"];
 }