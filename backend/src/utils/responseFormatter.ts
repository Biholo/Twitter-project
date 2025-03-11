import { Response } from "express";

export const formatResponse = (message: string, data: any = null) => ({
    message,
    data,
  });
  

  /**
   * Gère et retourne une erreur standardisée.
   * @param res - L'objet Response d'Express.
   * @param error - L'erreur survenue.
   * @param message - Message d'erreur personnalisé (optionnel).
   * @param status - Code HTTP à retourner (par défaut : 500).
   */
  export function handleError(
    res: Response,
    error: unknown,
    message: string = "Erreur interne du serveur.",
    status: number = 500
  ): void {
    // Vous pouvez ici ajouter de la journalisation ou enrichir l'erreur.
    console.error(error);
    res.status(status).json({ message: error.message });
  }

