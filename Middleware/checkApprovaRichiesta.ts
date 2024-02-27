import { Request, Response, NextFunction } from 'express';
import { Richieste } from '../Model/Richieste';

export async function checkRichiestaFormat(req: Request, res: Response, next: NextFunction) {
    const { id_richieste, stato_richiesta } = req.body;
    
    if (typeof id_richieste !== 'number' || typeof stato_richiesta !== 'string') {
        return res.status(400).json({ error: 'Formato del JSON non valido.' });
    }
    
    const richieste = await Richieste.findOne({ where: { id_richieste: id_richieste }, attributes: ['id_richieste', 'id_grafo', 'id_utente_request', 'id_utente_response', 'descrizione', 'modifiche', 'stato_richiesta'] });
    if (!richieste) {
        return res.status(404).json({ error: 'Richiesta non trovata.' });
    }

    if (stato_richiesta !== 'accettata' && stato_richiesta !== 'rifiutata') {
        return res.status(400).json({ error: 'Il campo stato_richiesta deve essere "accettata"/"rifiutata".' });
    }

    next();
}
