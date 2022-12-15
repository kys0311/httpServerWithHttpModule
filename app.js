const http = require("http")    // http 호출

const server = http.createServer()  // 서버 객체 생성

const users = [
    {
        id: 1,
        name: "Rebekah Johnson",
        email: "Glover12345@gmail.com",
        password: "123qwe",
    },
    {
        id: 2,
        name: "Fabian Predovic",
        email: "Connel129@gmail.com",
        password: "password",
    },
];

const posts = [ 
    {
        id: 1,
        title: "간단한 HTTP API 개발 시작!",
        content: "Node.js에 내장되어 있는 http 모듈을 사용해서 HTTP server를 구현.",
        userId: 1,
    },
    {
        id: 2,
        title: "HTTP의 특성",
        content: "Request/Response와 Stateless!!",
        userId: 1,
    }
];

const httpRequestListener = function(request, response) {
    const { url, method } = request

    if(method === "POST") {
        if(url === '/users/signup') {
            let body = "";

            request.on("data", (data) => {
                body += data;
            });

            request.on("end", () => {
                const user = JSON.parse(body);

                users.push({
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    password: user.password,
                });
                response.writeHead(200, {'Content-Type' : 'application/json'});
                response.end(JSON.stringify({"message" : "userCreated"}));
            });
        } else if(url === '/post') {
            let body = "";
            
            request.on("data", (data) => {
                body += data;
            });

            request.on("end", () => {
                const post = JSON.parse(body);

                posts.push({
                    id: post.id,
                    title: post.title,
                    content: post.content,
                    userId: post.userId,
                });
                response.writeHead(200, {'Content-Type' : 'application/json'});
                response.end(JSON.stringify({"message" : "postCreated"}));
            })
        }
    }

    if (method === "GET") {
        if(url === '/list') {
            const data = [];
            for(let i=0; i<posts.length; i++) {
                for(let j=0; j<users.length; j++) {
                    if(users[j].id === posts[i].userId) {
                        let userPost = {
                            "userID"         : users[j].id,
                            "userName"       : users[j].name,
                            "postingId"      : posts[i].id,
                            "postingTitle"   : posts[j].title,
                            "postingContent" : posts[j].content,
                        }
                        data.push(userPost);
                    }
                }
            }
            response.writeHead(200, {'Content-Type' : 'application/json'});
            response.end(JSON.stringify({"data" : data}));
        }
    }
}

server.on("request", httpRequestListener) // 서버 실행, request 리스너

const IP   = '127.0.0.1'
const PORT = 8000

server.listen(PORT, IP, function() {
    console.log(`Listening to request on ip ${IP} & port ${PORT}`)
})

