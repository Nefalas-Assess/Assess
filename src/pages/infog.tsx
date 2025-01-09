import React, { useState } from "react";
import '../style.css';

const ITP = () => {
  // Fonction pour créer une nouvelle ligne avec des valeurs par défaut
  const createRow = () => ({
    debut: "",         // Date de début par défaut
    fin: "",           // Date de fin par défaut
    jours: "",         // Nombre de jours calculé automatiquement
    indemniteitp: 32,     // Indemnité journalière par défaut
    indemniteitm: 30,
    pourcentage: "",   // Pourcentage d'application
    total: "",         // Total calculé automatiquement
  });

  // Fonction appelée lorsqu'une touche est pressée dans un champ d'entrée
  // Si la touche "Tab" est pressée sur la dernière ligne, une nouvelle ligne est ajoutée
  const handleKeyDown = (index, e) => {
    if (e.key === 'Tab' && index === rows.length - 1) {
      e.preventDefault(); // Empêche le comportement par défaut de "Tab"
      addRow(); // Ajoute une nouvelle ligne
    }
  };

  // État contenant la liste des lignes dans le tableau
  // Initialement, il y a une seule ligne créée avec la fonction `createRow`
  const [rows, setRows] = useState([createRow()]);

  // Fonction pour calculer le nombre de jours et le total pour une ligne donnée
  const calculateRow = (row) => {
    const { debut, fin, indemnite, pourcentage } = row;
    let jours = "";
    let total = "";

    if (debut && fin) {
      const debutDate = new Date(debut);
      const finDate = new Date(fin);
      if (!isNaN(debutDate) && !isNaN(finDate)) {
        // Calcul du nombre de jours entre les deux dates
        jours = Math.max(0, (finDate - debutDate) / (1000 * 60 * 60 * 24));
        // Calcul du total basé sur les jours, indemnité et pourcentage
        total = (jours * indemnite * (pourcentage / 100)).toFixed(2);
      }
    }
    return { jours, total };
  };

  // Fonction pour ajouter une nouvelle ligne dans le tableau
  const addRow = () => {
    let newRow = createRow();

    // Si une ligne existe déjà, on utilise la date de fin de la dernière ligne pour calculer la nouvelle date de début
    if (rows.length > 0) {
      const lastRowFin = rows[rows.length - 1].fin;
      if (lastRowFin) {
        const finDate = new Date(lastRowFin);
        if (!isNaN(finDate)) {
          finDate.setDate(finDate.getDate() + 1); // Ajoute 1 jour à la date de fin précédente
          newRow.debut = finDate.toISOString().split('T')[0]; // Formate la nouvelle date
        }
      }
    }

    // Ajoute la nouvelle ligne à l'état `rows`
    setRows([...rows, newRow]);
  };

  // Fonction pour gérer les changements dans les champs d'entrée
  // Met à jour les valeurs dans l'état `rows` et recalcul le total
  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value; // Met à jour la valeur du champ modifié
    const { jours, total } = calculateRow(updatedRows[index]); // Recalcule les champs dérivés
    updatedRows[index].jours = jours;
    updatedRows[index].total = total;
    setRows(updatedRows);
  };

  // Fonction pour calculer la somme totale de tous les totaux dans le tableau
  const getTotalSum = () => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0).toFixed(2);
  };

  // Fonction pour réinitialiser les données (après confirmation de l'utilisateur)
  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les données ?')) {
      setRows([createRow()]); // Réinitialise avec une seule ligne vide
    }
  };

  return (
      <div id="content">
        <div id="top-menu">
          <button onClick={() => { /* saveData logic */ }}>Sauvegarder</button>
          <input type="file" id="loadFileInput" style={{ display: 'none' }} onChange={() => { /* loadData logic */ }} />
          <button onClick={() => document.getElementById('loadFileInput').click()}>Charger</button>
          <button onClick={resetData}>Réinitialiser</button>
        </div>

        <div id="main">

          <h1>Informations générales</h1>

          <table id="infogTable">
                        <body>
                    <table>
                    <tr>
                        <td>Date de création/màj</td>
                        <td><input type="date" name="creation_maj_date" /></td>
                    </tr>
                    <tr>
                        <td>Référence du dossier</td>
                        <td><input type="text" name="reference_dossier" size="30"/></td>
                    </tr>
                    <tr>
                        <td>Nom de la victime</td>
                        <td><input type="text" name="nom_victime" size="30"/></td>
                    </tr>
                    <tr>
                        <td>Date de l'accident</td>
                        <td><input type="date" name="date_accident" /></td>
                    </tr>
                    <tr>
                        <td>Date de naissance</td>
                        <td><input type="date" name="date_naissance" /></td>
                    </tr>
                    <tr>
                        <td>Date de consolidation</td>
                        <td><input type="date" name="date_consolidation" /></td>
                    </tr>
                    <tr>
                        <td>Statut</td>
                        <td>
                            <select name="statut">
                                <option value="marié">Marié</option>
                                <option value="célibataire">Célibataire</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Profession</td>
                        <td>
                            <select name="profession">
                                <option value="employe">Employé</option>
                                <option value="ouvrier">Ouvrier</option>
                                <option value="sans_emploi">Sans emploi</option>
                                <option value="retraite">Retraité</option>
                                <option value="independant">Indépendant</option>
                                <option value="fonctionnaire">Fonctionnaire</option>
                                <option value="invalide">Invalide</option>
                            </select>
                        </td>
                    </tr>
                </table>
            </body>
          </table>
        </div>
      </div>
  );
};

export default ITP;