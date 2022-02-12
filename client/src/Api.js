//const API_URL = 'http://localhost:1337'



export async function callAPI(inputChar){
    const response = await fetch(`/word?char=${inputChar}`);
    return response.json();
}
