import express from 'express';
import bodyParser from 'body-parser';
import serveIndex from 'serve-index';
import { queueUp } from './generator';

let port = 5927; // 填写端口号

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/static', serveIndex('static', {icons: true}));
app.use('/static', express.static('static'));

app.post("/api/composition", queueUp);

app.listen(port, () => {
  console.log(`Application has started on Port ${port}`);
});
