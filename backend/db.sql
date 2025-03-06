CREATE TABLE Chretien (
    id_chretien INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    prenom VARCHAR(100),
    date_naissance DATE,
    adresse TEXT,
    contact VARCHAR(50),
    statut ENUM('actif', 'décédé', 'nouveau', 'affecté')
);

CREATE TABLE Role (
    id_role INT PRIMARY KEY AUTO_INCREMENT,
    libelle VARCHAR(100) UNIQUE
);

CREATE TABLE Chretien_Role (
    id_chretien INT,
    id_role INT,
    PRIMARY KEY (id_chretien, id_role),
    FOREIGN KEY (id_chretien) REFERENCES Chretien(id_chretien),
    FOREIGN KEY (id_role) REFERENCES Role(id_role)
);

CREATE TABLE Evenement (
    id_evenement INT PRIMARY KEY AUTO_INCREMENT,
    type_evenement ENUM('baptême', 'mariage', 'décès', 'autre'),
    date_evenement DATE,
    description TEXT,
    id_chretien INT,
    FOREIGN KEY (id_chretien) REFERENCES Chretien(id_chretien)
);

CREATE TABLE Synode (
    id_synode INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(150),
    adresse TEXT
);

CREATE TABLE Paroisse (
    id_paroisse INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(150),
    adresse TEXT,
    id_synode INT,
    FOREIGN KEY (id_synode) REFERENCES Synode(id_synode)
);

CREATE TABLE Eglise (
    id_eglise INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(150),
    type ENUM('catholique', 'protestante', 'évangélique', 'autre'),
    id_paroisse INT,
    id_synode INT,
    FOREIGN KEY (id_paroisse) REFERENCES Paroisse(id_paroisse),
    FOREIGN KEY (id_synode) REFERENCES Synode(id_synode)
);

CREATE TABLE Utilisateur (
    id_utilisateur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    mot_de_passe VARCHAR(255),
    role ENUM('admin', 'secretaire', 'pasteur')
);

CREATE TABLE Finance (
    id_finance INT PRIMARY KEY AUTO_INCREMENT,
    montant DECIMAL(10,2),
    type ENUM('donation', 'collecte', 'dépense'),
    date DATE,
    description TEXT,
    id_eglise INT,
    FOREIGN KEY (id_eglise) REFERENCES Eglise(id_eglise)
);

CREATE TABLE Attestation (
    id_attestation INT PRIMARY KEY AUTO_INCREMENT,
    type_attestation ENUM('baptême', 'mariage', 'confirmation', 'autre'),
    date_delivrance DATE,
    id_chretien INT,
    FOREIGN KEY (id_chretien) REFERENCES Chretien(id_chretien)
);

CREATE TABLE Visiteur (
    id_visiteur INT PRIMARY KEY AUTO_INCREMENT,
    nom VARCHAR(100),
    email VARCHAR(100),
    message TEXT,
    date_visite DATETIME DEFAULT CURRENT_TIMESTAMP
);
ALTER TABLE Chretien ADD COLUMN date_adhesion DATE;
ALTER TABLE Evenement ADD COLUMN id_chretien_conjoint INT,
ADD FOREIGN KEY (id_chretien_conjoint) REFERENCES Chretien(id_chretien);
