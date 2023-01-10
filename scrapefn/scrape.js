// const { response } = require('express');
const puppeteer = require('puppeteer');
const fs = require('fs');
const data = {
    list: []
};

async function main(skill){
    //launches chromium 
    const browser = await puppeteer.launch({headless: false})//we have put headless as false because we want to see the browser being opened and closed
    const page= await browser.newPage();//open new page  
    https://in.indeed.com/jobs?q=full+stack+developer+fresher&l=Anywhere&from=searchOnHP&vjk=c16b89d4edf9f1f8
    
    
    await page.goto(`https://in.indeed.com/jobs?q=${skill}&l=Anywhere&from=searchOnHP&vjk=c16b89d4edf9f1f8`,
     {
        Timeout: 0,
        waitUntil: 'networkidle0'
     });

     // Now I want to insert javascript in the url to fetch the data
     const jobData = await page.evaluate(async(data) =>{
        const items = document.querySelectorAll('td.resultContent');
        items.forEach((item,index) =>{
            const title  = item.querySelector('h2.jobTitle>a')?.innerText ;
            const link = item.querySelector('h2.jobTitle>a')?.href;
            const salary = item.querySelector('div.metadata.salary-snippet-container > div')?.innertext;
            const companyName = item.querySelector('span.companyName')?.innerText;

            if (salary== null) {
                salary = "not defined"
            }
            data.list.push({
                title,
                salary,
                companyName, 
                link
            });
        });
        return data ;

     },data);
      let response = await jobData;
      let json = JSON.stringify(jobData, null, 2);
      fs.writeFile('job.json', json, 'utf-8',  () =>{
        console.log('written in job.json'); 
      })


     
    browser.close();//close browser when every thing is done
    return response;
};
module.exports = main;