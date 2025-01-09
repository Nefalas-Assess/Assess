import React, { useState } from "react";
import './style.css';

const ITP = () => {
  // Fonction pour créer une nouvelle ligne avec des valeurs par défaut
  const createRow = () => ({
    debut: "",         // Date de début par défaut
    fin: "",           // Date de fin par défaut
    jours: "",         // Nombre de jours calculé automatiquement
    indemnite: "",     // Indemnité journalière par défaut
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
    <div className="app">
      <div id="menu">
        <button type="button">Informations générales</button>
        <button type="button">Incapacité Temporaire Personnelle</button>
        <button type="button">Incapacité Temporaire Ménagère</button>
        <button type="button">Incapacité Temporaire Économique</button>
        <button type="button">Efforts Accrus</button>
        <button type="button">Hospitalisation</button>
        <button type="button">Pretium Doloris</button>
        <button type="button">Préjudice Esthétique</button>
        <button type="button">Incapacité Permanente Personnelle Forfait</button>
        <button type="button">Incapacité Permanente Ménagère Forfait</button>
        <button type="button">Incapacité Permanente Économique Forfait</button>
        <button type="button">Incapacité Permanente Personnelle CAP</button>
        <button type="button">Incapacité Permanente Ménagère CAP</button>
        <button type="button">Incapacité Permanente Économique CAP</button>
        <button type="button">Frais</button>
        <button type="button">Provisions</button>
        <button type="button">Récapitulatif</button>
      </div>

      <div id="content">
        <div id="top-menu">
          <button onClick={() => { /* saveData logic */ }}>Sauvegarder</button>
          <input type="file" id="loadFileInput" style={{ display: 'none' }} onChange={() => { /* loadData logic */ }} />
          <button onClick={() => document.getElementById('loadFileInput').click()}>Charger</button>
          <button onClick={resetData}>Réinitialiser</button>
        </div>

        <h1>Incapacités temporaires personnelles</h1>

        <table id="itpTable">
          <thead>
            <tr>
              <th>Début</th>
              <th>Fin</th>
              <th>Jours</th>
              <th>Indemnité journalière (€)</th>
              <th>%</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="date" value={row.debut} onChange={(e) => handleInputChange(index, 'debut', e.target.value)} /></td>
                <td><input type="date" value={row.fin} onChange={(e) => handleInputChange(index, 'fin', e.target.value)} /></td>
                <td><input type="number" value={row.jours} readOnly /></td>
                <td><input type="number" value={row.indemnite} step="0.01" onChange={(e) => handleInputChange(index, 'indemnite', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.pourcentage} step="0.01" onChange={(e) => handleInputChange(index, 'pourcentage', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.total} readOnly onKeyDown={(e) => handleKeyDown(index, e)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>+</button>

        <div className="total-box">
          <strong>Total : </strong> {getTotalSum()} €
        </div>

        <h1>Incapacités temporaires ménagères</h1>

        <table id="itmTable">
          <thead>
            <tr>
              <th>Début</th>
              <th>Fin</th>
              <th>Jours</th>
              <th>Indemnité journalière (€)</th>
              <th>Enfant(s)</th>
              <th>%</th>
              <th>Contribution (%)</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="date" value={row.debut} onChange={(e) => handleInputChange(index, 'debut', e.target.value)} /></td>
                <td><input type="date" value={row.fin} onChange={(e) => handleInputChange(index, 'fin', e.target.value)} /></td>
                <td><input type="number" value={row.jours} readOnly /></td>
                <td><input type="number" value={row.indemnite} step="0.01" readOnly /></td>
                <td><input type="number" value={row.enfants} onChange={(e) => handleInputChange(index, 'enfants', parseInt(e.target.value) || 0)} /></td>
                <td><input type="number" value={row.pourcentage} step="0.01" onChange={(e) => handleInputChange(index, 'pourcentage', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.contribution} step="0.01" onChange={(e) => handleInputChange(index, 'contribution', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.total} readOnly onKeyDown={(e) => handleKeyDown(index, e)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>+</button>

        <div className="total-box">
          <strong>Total : </strong> {getTotalSum()} €
        </div>
        
        <h1>Efforts accrus</h1>

        <table id="effaTable">
          <thead>
            <tr>
              <th>Début</th>
              <th>Fin</th>
              <th>Jours</th>
              <th>Indemnité journalière (€)</th>
              <th>%</th>
              <th>Coefficient</th>
              <th>Total (€)</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={index}>
                <td><input type="date" value={row.debut} onChange={(e) => handleInputChange(index, 'debut', e.target.value)} /></td>
                <td><input type="date" value={row.fin} onChange={(e) => handleInputChange(index, 'fin', e.target.value)} /></td>
                <td><input type="number" value={row.jours} readOnly /></td>
                <td><input type="number" value={row.indemnite} step="0.01" onChange={(e) => handleInputChange(index, 'indemnite', parseFloat(e.target.value))} /></td>
                <td><input type="number" value={row.pourcentage} step="0.01" onChange={(e) => handleInputChange(index, 'pourcentage', parseFloat(e.target.value))} /></td>
                <td>
                  <select value={row.coefficient} onChange={(e) => handleInputChange(index, 'coefficient', e.target.value)}>
                    {["1/7", "2/7", "3/7", "4/7", "5/7", "6/7", "7/7"].map((coeff) => (
                      <option key={coeff} value={coeff}>{coeff}</option>
                    ))}
                  </select>
                </td>
                <td><input type="number" value={row.total} readOnly onKeyDown={(e) => handleKeyDown(index, e)} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>+</button>

        <div className="total-box">
          <strong>Total : </strong> {getTotalSum()} €
        </div>

        



      </div>
    </div>
  );
};

export default ITP;