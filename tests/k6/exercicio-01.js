import http from 'k6/http';
import { expect} from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
    let res = http.post('http://localhost:3000/instructors/login', JSON.stringify({
        email: "gui@gui.com", password: "12345"
    }), {headers: {'Content-Type': 'application/json'}});
    let result = JSON.parse(res.body);
    let progress = http.post('http://localhost:3000/progress', {headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${result.token}`}});
    
    console.log(progress.body);
    console.log(res.body);
    
    console.log(`Token: ${result.token}`);
    sleep(1);
}
 