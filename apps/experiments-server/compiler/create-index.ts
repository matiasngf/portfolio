import * as fs from 'fs';
import * as path from 'path';
import { ExperimentConfigExtended } from './experiment-config-schema';

export function createIndex(experiments: ExperimentConfigExtended[]) {
  const vercelOutputPath = path.resolve(process.cwd(), '.vercel', 'output', 'static');
  const indexPath = path.join(vercelOutputPath, 'index.html');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Experiments</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      background-color: #000;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    ul {
      list-style: none;
      text-align: center;
    }
    li {
      margin: 1rem 0;
    }
    a {
      color: #fff;
      text-decoration: none;
      font-size: 1.25rem;
      transition: opacity 0.2s;
    }
    a:hover {
      opacity: 0.7;
    }
  </style>
</head>
<body>
  <ul>
${experiments.map(experiment => `    <li><a href="/${experiment.name}/">${experiment.name}</a></li>`).join('\n')}
  </ul>
</body>
</html>`;

  fs.writeFileSync(indexPath, html);
}
