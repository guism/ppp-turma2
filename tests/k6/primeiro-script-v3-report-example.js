import http from 'k6/http';
import { expect} from "https://jslib.k6.io/k6-testing/0.5.0/index.js";
import { sleep, check } from 'k6';

// OBS: relatorio online é meio lento, acreditp que é melhor gerar um relatório local com o comando:
// K6_WEB_DASHBOARD=true K6_WEB_DASHBOARD_EXPORT=html-report.html K6_WEB_DASHBOARD_PERIOD=100ms k6 run tests/k6/primeiro-script-v3-report-example-file.js
// e depois abrir o arquivo report.html no navegador

 
// PARA GERAR O REPORT ONLINE, RODAR ESSE COMANDO:
// K6_WEB_DASHBOARD=true k6_WEB_DASHBOARD_PERIOD=100ms k6 run tests/k6/primeiro-script-v3-report-example.js
// O ideal é rodar no GIT BASH PARA FUNCIONAR ESSA VARIÁVEL DE AMBIENTE
//acho que roda no WINDOWS CMD assim: set K6_WEB_DASHBOARD=true && set K6_WEB_DASHBOARD_PERIOD=100ms && k6 run tests/k6/primeiro-script-v3-report-example.js  

export const options = {
  vus: 10,
  duration: '20s',
  thresholds: {
    http_req_duration: ['p(95)<500', 'p(90)<=500'],// 95% das requisições devem ser menores que 500ms e 90% menores que 3ms
    http_req_failed: ['rate<0.01'] ,// Menos de 1% das requisições podem falhar
  }
};

export default function() {
    let responseInstructorLogin = http.post('http://localhost:3000/instructors/login', JSON.stringify({
        email: "gui@gui.com", password: "12345"
    }), {headers: {'Content-Type': 'application/json'}});

    let responseLesson = http.post('http://localhost:3000/lessons', JSON.stringify({
        title: "codar", description: "codar é muito legal",
    }), {headers: {'Authorization': `Bearer ${responseInstructorLogin.json('token')}`, 'Content-Type': 'application/json'}});

    check(responseLesson, {
        "status is 201": (res) => res.status === 201,
        "lesson created with correct title": (res) => res.json('title') === "codar",
    });

    sleep(1);
}
 