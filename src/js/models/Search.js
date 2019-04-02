// export default `I am an exported string`

import axios from 'axios';
import  { key } from '../config.js';

export default class Search{
    constructor(query) {
        this.query = query;
    }

    async getResults(){
        const key = '921914eac9c6a11c1c32ea02821f7db6';
        try {
            const res = await axios(`https://www.food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes;
            // console.log(this.result);
        } catch (error){
            alert(error);
        }
        
    }
}