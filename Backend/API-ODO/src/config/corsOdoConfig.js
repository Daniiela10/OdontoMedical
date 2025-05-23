import cors from "cors";

const corsOptions = {
    origin: '*', 
    methods: 'GET,POST,PATCH,DELETE',
    allowedHeaders: ['Authorization', 'Content-Type']
};

export default cors(corsOptions);