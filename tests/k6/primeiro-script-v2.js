import http from 'k6/http';
import { expect} from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { sleep, check } from 'k6';

export const options = {
  vus: 1,
  iterations: 1,
};

export default function() {
    let responseInstructorLogin = http.post('http://localhost:3000/instructors/login', JSON.stringify({
        email: "gui@gui.com", password: "12345"
    }), {headers: {'Content-Type': 'application/json'}});

    let responseLesson = http.post('http://localhost:3000/lessons', JSON.stringify({
        title: "codar", description: "codar é muito legal",
    }), {headers: {'Authorization': `Bearer ${responseInstructorLogin.json('token')}`, 'Content-Type': 'application/json'}});

    console.log(responseLesson.body);


    check(responseLesson, {
        "status is 201": (res) => res.status === 201,
        "lesson created with correct title": (res) => res.json('title') === "codar",
    });

    sleep(1);
}
 