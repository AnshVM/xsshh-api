import express, { Request, Response } from 'express';
import cors from 'cors';
import { Analyzer } from "./engine";

const app = express();
const port = process.env.PORT || 3001;

// Middleware for parsing JSON data
app.use(express.json());

// Enable CORS
app.use(cors());

// Define a single POST endpoint
app.post('/analyze', (req: Request, res: Response) => {
  try {
    const requestData = req.body;

    if (!requestData || !requestData.scripts || !Array.isArray(requestData.scripts)) {
      res.status(400).json({ error: 'Invalid request format' });
      return;
    }

    const scripts = requestData.scripts;
    const vectors = scripts.map((script:string) => {
        const analyzer = new Analyzer(script)
        analyzer.run()
        return analyzer.reports.join('\n')
    });

    res.json({ vectors });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the Express server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

