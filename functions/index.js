const functions = require('firebase-functions');
const express = require('express');
const requestPromise = require('request-promise-native');
const cors = require('cors');

const app = express();
// 全部のリクエストを許可するための記述
app.use(cors());

// APIにリクエストを送る処理
const getDataFromApi = async keyword => {
    // cloud functionsから実行する場合には地域の設定が必要になるため，`country=JP`を追加している
    const requestUrl = 'https://www.googleapis.com/books/v1/volumes?country=JP&q=intitle:';
    const result = await requestPromise(`${requestUrl}${keyword}`);
    return result;
}

app.get('/hello', (req, res) => {
    res.send('Hello Express!');
})

app.get('/user/:userId', (req, res) => {
    const user = [
        { id: 1, name: 'ジョナサン' },
        { id: 2, name: 'ジョセフ' },
        { id: 3, name: '承太郎' },
        { id: 4, name: '仗助' },
        { id: 5, name: 'ジョルノ' }
    ];
    // req.params.userIdでURLの後ろにつけた値をとれる
    const targetUser = user.find(user => user.id === Number(req.params.userId));
    res.send(targetUser);
})

// エンドポイント追加
app.get('/gbooks/:keyword', async(req, res) => {
    const response = await getDataFromApi(req.params.keyword);
    res.send(response);
})

// 以降変更なし
const api = functions.https.onRequest(app);
module.exports = { api };

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//     response.send("Hello from Firebase!");
// });