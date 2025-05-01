import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const app = express();

// Middleware to parse JSON request bodies
app.use(express.json());

// Resolve __dirname using import.meta.url
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Route to get the content of cars.json
app.get('/cars', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, '../cars.json');

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const carsData = JSON.parse(fileContent);
    res.status(200).json({
      status: 'success',
      data: carsData,
    });
  } catch (error) {
    console.error('Error reading cars.json:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to read cars.json',
    });
  }
});

// Route to update a car in cars.json
app.post('/cars/update', (req: Request, res: Response) => {
  const filePath = path.resolve(__dirname, '../cars.json');
  const { vin_id, updates } = req.body;

  if (!vin_id ) {
     res.status(400).json({
      status: 'error',
      message: 'vin_id is required in the request body.',
    });
    return;
  }

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const carsData = JSON.parse(fileContent);

    // Find the car by vin_id
    const carIndex = carsData.findIndex((car: any) => car.vin_id === vin_id);
    if (carIndex === -1) {
       res.status(404).json({
        status: 'error',
        message: `Car with vin_id ${vin_id} not found.`,
      });
      return;
    }

    // Update the car details
    carsData[carIndex] = {
      ...carsData[carIndex],
      availability: 0,
    };

    // Write the updated data back to cars.json
    fs.writeFileSync(filePath, JSON.stringify(carsData, null, 2), 'utf-8');

    res.status(200).json({
      status: 'success',
      message: `Car with vin_id ${vin_id} updated successfully.`,
      data: carsData[carIndex],
    });
  } catch (error) {
    console.error('Error updating cars.json:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to update cars.json.',
    });
  }
});

// Default route
app.get('/', (req: Request, res: Response) => {
    res.send('Express on Vercel');
    return;
});

// Export the app for serverless deployment
export default app;