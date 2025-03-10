import User from "@/models/userModel";
import { userFixtures } from "./userFixture";


/**
 * Charge l'ensemble des fixtures dans la base de données.
 * Cette fonction peut être appelée au démarrage en environnement de développement ou lors des tests.
 */
export async function loadFixtures(): Promise<void> {
  try {
    // Ici on peut nettoyer les collections avant d'insérer des données de test.
    await User.deleteMany({});
    await User.insertMany(userFixtures);
    console.log("Les fixtures ont été chargées avec succès !");
  } catch (error) {
    console.error("Erreur lors du chargement des fixtures :", error);
  }
}