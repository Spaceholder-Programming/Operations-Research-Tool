
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        res.status(200).json({ message: 'API is working!' });
    } else {
        res.status(405).json({ message: 'Method not allowed' });
    }
}