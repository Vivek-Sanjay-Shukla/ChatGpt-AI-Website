import express from 'express'
import * as dotenv from 'dotenv'
import cors from 'cors'
import { Configuration,OpenAIApi } from 'openai'

dotenv.config();

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/',async (req,res) => {
    res.status(200).send({
        message:'Hello',
    })
})

app.post('/',async (req,res)=>{
    try {
        const prompt = req.body.prompt

        const response = await openai.createCompletion({
            model:"text-davinci-003",
            prompt:`${prompt}`,
            temperature:0,  // if its high our website take more risk
            max_tokens: 3000,  //maximum numbers of tokens generated  this model has 4096 tokens support
            top_p:1,  
            frequency_penalty:0.5,//if 0 means it will not repeat similar setences to often
            presence_penalty:0,
        })

        res.status(200).send({
            bot:response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({error})
    }
})

app.listen(5000,() => console.log('server running  http://localhost:5000'))

