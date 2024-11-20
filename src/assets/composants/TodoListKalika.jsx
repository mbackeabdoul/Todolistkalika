import React, { useState, useEffect } from 'react';

const ListeTaches = () => {
  const [taches, setTaches] = useState(() => {
    const tachesSauvegardees = localStorage.getItem('taches');
    return tachesSauvegardees ? JSON.parse(tachesSauvegardees) : [];
  });

  const [recherche, setRecherche] = useState('');
  const [modalOuvert, setModalOuvert] = useState(false);
  const [tacheCourante, setTacheCourante] = useState({ titre: '', description: '' });
  const [tacheEnEdition, setTacheEnEdition] = useState(null);

  const [pageActuelle, setPageActuelle] = useState(1);
  const tachesParPage = 1;

  useEffect(() => {
    localStorage.setItem('taches', JSON.stringify(taches));
  }, [taches]);

  const ajouterOuModifierTache = () => {
    if (tacheCourante.titre.trim()) {
      if (tacheEnEdition) {
        setTaches((prevTaches) =>
          prevTaches.map((tache) =>
            tache.id === tacheEnEdition.id
              ? { ...tacheCourante, id: tache.id }
              : tache
          )
        );
        setTacheEnEdition(null);
      } else {
        const nouvelleTache = {
          ...tacheCourante,
          id: Date.now(),
          dateCreation: new Date().toLocaleString(),
        };
        setTaches((prevTaches) => [...prevTaches, nouvelleTache]);
      }
      fermerModal();
    }
  };

  const supprimerTache = (id) =>
    setTaches((prevTaches) => prevTaches.filter((tache) => tache.id !== id));

  const modifierTache = (tache) => {
    setTacheCourante({ titre: tache.titre, description: tache.description });
    setTacheEnEdition(tache);
    setModalOuvert(true);
  };

  const voirDetails = (tache) =>
    alert(`Détails de la tâche :\nTitre : ${tache.titre}\nDescription : ${tache.description}`);

  const fermerModal = () => {
    setTacheCourante({ titre: '', description: '' });
    setModalOuvert(false);
  };

  const tachesFiltrees = taches.filter((tache) =>
    tache.titre.toLowerCase().includes(recherche.toLowerCase())
  );

  const indexDernier = pageActuelle * tachesParPage;
  const indexPremier = indexDernier - tachesParPage;
  const tachesPaginées = tachesFiltrees.slice(indexPremier, indexDernier);

  const changerPage = (page) => setPageActuelle(page);

  const nombrePages = Math.ceil(tachesFiltrees.length / tachesParPage);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex mb-4 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Rechercher une tâche"
          value={recherche}
          onChange={(e) => {
            setRecherche(e.target.value);
            setPageActuelle(1);
          }}
          className="flex-grow sm:w-1/2 md:w-2/3 p-2 border rounded"
        />
        <button
          onClick={() => setModalOuvert(true)}
          className="bg-blue-500 text-white p-2 w-full sm:w-auto md:w-40 rounded"
        >
          Ajouter
        </button>
      </div>

      {/* Tableau des tâches */}
      <table className="w-full table-auto border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="p-2 text-left border-b">Tâche</th>
            <th className="p-2 text-left border-b">Description</th>
            <th className="p-2 text-left border-b">Action</th>
          </tr>
        </thead>
        <tbody>
          {tachesPaginées.map((tache) => (
            <tr key={tache.id} className="border-b">
              <td className="p-2">{tache.titre}</td>
              <td className="p-2">{tache.description}</td>
              <td className="p-2">
                <div className="flex space-x-2">
                  <button
                    onClick={() => modifierTache(tache)}
                    className="bg-blue-100 text-blue-500 px-2 py-1 rounded"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => voirDetails(tache)}
                    className="bg-green-100 text-green-500 px-2 py-1 rounded"
                  >
                    Voir
                  </button>
                  <button
                    onClick={() => supprimerTache(tache.id)}
                    className="bg-red-100 text-red-500 px-2 py-1 rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {nombrePages > 1 && (
        <div className="flex justify-center items-center mt-4 space-x-2">
          <button
            onClick={() => changerPage(pageActuelle - 1)}
            disabled={pageActuelle === 1}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Précédent
          </button>

          {[...Array(nombrePages)].map((_, index) => (
            <button
              key={index}
              onClick={() => changerPage(index + 1)}
              className={`px-3 py-1 rounded ${
                pageActuelle === index + 1
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200'
              }`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={() => changerPage(pageActuelle + 1)}
            disabled={pageActuelle === nombrePages}
            className="p-2 rounded bg-gray-200 disabled:opacity-50"
          >
            Suivant
          </button>
        </div>
      )}

      {/* Modal */}
      {modalOuvert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full sm:w-96 md:w-1/3">
            <h2 className="text-xl mb-4">
              {tacheEnEdition ? 'Modifier la tâche' : 'Ajouter une tâche'}
            </h2>
            <input
              type="text"
              placeholder="Titre de la tâche"
              value={tacheCourante.titre}
              onChange={(e) =>
                setTacheCourante({ ...tacheCourante, titre: e.target.value })
              }
              className="w-full p-2 border rounded mb-4"
            />
            <textarea
              placeholder="Description"
              value={tacheCourante.description}
              onChange={(e) =>
                setTacheCourante({ ...tacheCourante, description: e.target.value })
              }
              className="w-full p-2 border rounded mb-4 h-24"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={fermerModal}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded"
              >
                Annuler
              </button>
              <button
                onClick={ajouterOuModifierTache}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                {tacheEnEdition ? 'Modifier' : 'Envoyer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListeTaches;
