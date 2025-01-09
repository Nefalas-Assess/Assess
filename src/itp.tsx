import React, { useState } from "react";
import './style.css';

const ITP = () => {
  const createRow = () => ({
    debut: "",
    fin: "",
    jours: "",
    indemnite: 32,
    pourcentage: "",
    total: "",
  });

  const handleKeyDown = (index, e) => {
    if (e.key === 'Tab' && index === rows.length - 1) {
      e.preventDefault(); // Empêche le comportement par défaut de la touche Tab
      addRow(); // Ajoute une nouvelle ligne
    }
  };

  const [rows, setRows] = useState([createRow()]);
  const [category, setCategory] = useState("IT Personnelle");

  const calculateRow = (row) => {
    const { debut, fin, indemnite, pourcentage } = row;
    let jours = "";
    let total = "";

    if (debut && fin) {
      const debutDate = new Date(debut);
      const finDate = new Date(fin);
      if (!isNaN(debutDate) && !isNaN(finDate)) {
        jours = Math.max(0, (finDate - debutDate) / (1000 * 60 * 60 * 24));
        total = (jours * indemnite * (pourcentage / 100)).toFixed(2);
      }
    }
    return { jours, total };
  };

  const addRow = () => {
    let newRow = createRow();

    if (rows.length > 0) {
      const lastRowFin = rows[rows.length - 1].fin;
      if (lastRowFin) {
        const finDate = new Date(lastRowFin);
        if (!isNaN(finDate)) {
          finDate.setDate(finDate.getDate() + 1);
          newRow.debut = finDate.toISOString().split('T')[0];
        }
      }
    }

    setRows([...rows, newRow]);
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    const { jours, total } = calculateRow(updatedRows[index]);
    updatedRows[index].jours = jours;
    updatedRows[index].total = total;
    setRows(updatedRows);
  };

  const getTotalSum = () => {
    return rows.reduce((sum, row) => sum + (parseFloat(row.total) || 0), 0).toFixed(2);
  };

  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les données ?')) {
      setRows([createRow()]); // Réinitialiser les lignes à une seule ligne vide
    }
  };

  return (
    <div className="app">
      <div id="menu">
        <button onClick={() => setCategory("Informations générales")}>Informations générales</button>
        <button onClick={() => setCategory("Incapacité Temporaire Personnelle")}>Incapacité Temporaire Personnelle</button>
        <button onClick={() => setCategory("Incapacité Temporaire Ménagère")}>Incapacité Temporaire Ménagère</button>
        <button onClick={() => setCategory("Incapacité Temporaire Économique")}>Incapacité Temporaire Économique</button>
        <button onClick={() => setCategory("Efforts Accrus")}>Efforts Accrus</button>
        <button onClick={() => setCategory("Hospitalisation")}>Hospitalisation</button>
        <button onClick={() => setCategory("Pretium Doloris")}>Pretium Doloris</button>
        <button onClick={() => setCategory("Préjudice Esthétique")}>Préjudice Esthétique</button>
        <button onClick={() => setCategory("Incapacité Permanente Personnelle Forfait")}>Incapacité Permanente Personnelle Forfait</button>
        <button onClick={() => setCategory("Incapacité Permanente Ménagère Forfait")}>Incapacité Permanente Ménagère Forfait</button>
        <button onClick={() => setCategory("Incapacité Permanente Économique Forfait")}>Incapacité Permanente Économique Forfait</button>
        <button onClick={() => setCategory("Incapacité Permanente Personnelle CAP")}>Incapacité Permanente Personnelle CAP</button>
        <button onClick={() => setCategory("Incapacité Permanente Ménagère CAP")}>Incapacité Permanente Ménagère CAP</button>
        <button onClick={() => setCategory("Incapacité Permanente Économique CAP")}>Incapacité Permanente Économique CAP</button>
        <button onClick={() => setCategory("Frais")}>Frais</button>
        <button onClick={() => setCategory("Provisions")}>Provisions</button>
        <button onClick={() => setCategory("Récapitulatif")}>Récapitulatif</button>
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
              <th>Enfant(s)</th> {/* New column for children */}
              <th>%</th>
              <th>Contribution (%)</th> {/* New column for contribution */}
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