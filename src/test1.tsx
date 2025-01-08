import React, { useState } from "react";
import './test1.css';

const Test1 = () => {
  const createRow = () => ({
    debut: "",
    fin: "",
    jours: "",
    indemnite: 32,
    pourcentage: "",
    total: "",
  });

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
    const newRow = createRow();
    setRows([...rows, newRow]);
  };

  const saveData = () => {
    const data = rows.map(row => ({
      debut: row.debut,
      fin: row.fin,
      jours: row.jours,
      indemnite: row.indemnite,
      pourcentage: row.pourcentage,
      total: row.total,
    }));
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'feuille_de_calcul.json';
    link.click();
    alert('Les données ont été sauvegardées.');
  };

  const loadData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const loadedData = JSON.parse(e.target.result);
        setRows(loadedData.map(createRow));
        alert('Les données ont été chargées.');
      };
      reader.readAsText(file);
    }
  };

  const resetData = () => {
    if (window.confirm('Êtes-vous sûr de vouloir réinitialiser les données ?')) {
      setRows([createRow()]);
    }
  };

  const handleInputChange = (index, field, value) => {
    const updatedRows = [...rows];
    updatedRows[index][field] = value;
    const { jours, total } = calculateRow(updatedRows[index]);
    updatedRows[index].jours = jours;
    updatedRows[index].total = total;
    setRows(updatedRows);
  };

  const changeCategory = (newCategory) => {
    setCategory(newCategory);
  };

  return (
    <div className="app">
      <div id="menu">
        <button onClick={() => changeCategory("Incapacité Temporaire Personnelle")}>Incapacité Temporaire Personnelle</button>
        <button onClick={() => changeCategory("Incapacité Temporaire Ménagère")}>Incapacité Temporaire Ménagère</button>
        <button onClick={() => changeCategory("Incapacité Temporaire Économique")}>Incapacité Temporaire Économique</button>
        <button onClick={() => changeCategory("Efforts Accrus")}>Efforts Accrus</button>
        <button onClick={() => changeCategory("Hospitalisation")}>Hospitalisation</button>
        <button onClick={() => changeCategory("Pretium Doloris")}>Pretium Doloris</button>
        <button onClick={() => changeCategory("Préjudice Esthétique")}>Préjudice Esthétique</button>
        <button onClick={() => changeCategory("Incapacité Permanente Personnelle Forfait")}>Incapacité Permanente Personnelle Forfait</button>
        <button onClick={() => changeCategory("Incapacité Permanente Ménagère Forfait")}>Incapacité Permanente Ménagère Forfait</button>
        <button onClick={() => changeCategory("Incapacité Permanente Économique Forfait")}>Incapacité Permanente Économique Forfait</button>
        <button onClick={() => changeCategory("Incapacité Permanente Personnelle CAP")}>Incapacité Permanente Personnelle CAP</button>
        <button onClick={() => changeCategory("Incapacité Permanente Ménagère CAP")}>Incapacité Permanente Ménagère CAP</button>
        <button onClick={() => changeCategory("Incapacité Permanente Économique CAP")}>Incapacité Permanente Économique CAP</button>
        <button onClick={() => changeCategory("Frais")}>Frais</button>
        <button onClick={() => changeCategory("Provisions")}>Provisions</button>
        <button onClick={() => changeCategory("Récapitulatif")}>Récapitulatif</button>
      </div>

      <div id="content">
        <div id="top-menu">
          <button onClick={saveData}>Sauvegarder</button>
          <input type="file" id="loadFileInput" style={{ display: 'none' }} onChange={loadData} />
          <button onClick={() => document.getElementById('loadFileInput').click()}>Charger</button>
          <button onClick={resetData}>Réinitialiser</button>
        </div>

        <h1>{category}</h1>

        <table id="itTable">
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
                <td><input type="number" value={row.total} readOnly /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={addRow}>+</button>
      </div>
    </div>
  );
};

export default Test1;