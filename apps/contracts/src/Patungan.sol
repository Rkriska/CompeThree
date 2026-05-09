// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract Patungan {
    address public owner;
    address public bendahara; // 0x0000000000....
    uint256 public targetTotal;
    uint256 public totalTerkumpul;
    bool public aktif;

    string public namaPatungan; // beli mcleren
    address[] public daftarAnggota; // list semua yang ikut patungan

    // default(0x... => 0);
    mapping(address => uint256) public iuranAnggota; // iuran setiap anggota
    // 0xpolykarpus => 100
    // 0xmanik => 200
    //(300) 0xmanik => 500

    struct DataAnggota {
        string nama; // ""
        uint256 jumlahBayar; // 0
        bool sudahDaftar; // false
    }

    mapping(address => DataAnggota) public anggota;

    event BendaharaSet(address newBendahara);
    event AktifSet(bool newAktif);
    event TargetTotalSet(uint256 newTargetTotal);
    event Daftar(address indexed anggota, string nama);
    event Setor(address indexed anggota, uint256 jumlah);

    constructor() {
        owner = msg.sender;
    }

    function setBendahara(address _bendahara) external {
        require(msg.sender == owner, "Hanya owner yang dapat mengubah bendahara");
        bendahara = _bendahara;
        emit BendaharaSet(_bendahara);
    }

    function setAktif(bool _aktif) external {
        require(msg.sender == bendahara, "Hanya bendahara yang dapat mengaktifkan/menonaktifkan patungan");
        aktif = _aktif;

        emit AktifSet(_aktif);
    }

    function setTargetTotal(uint256 _targetTotal) external {
        require(msg.sender == bendahara, "Hanya bendahara yang dapat mengubah target total");
        targetTotal = _targetTotal;

        emit TargetTotalSet(_targetTotal);
    }

    function daftar(string calldata _nama) external {
        anggota[msg.sender] = DataAnggota({nama: _nama, jumlahBayar: 0, sudahDaftar: true});
        
        require(anggota[msg.sender].sudahDaftar, "Anggota sudah daftar");
        daftarAnggota.push(msg.sender);
        emit Daftar(msg.sender, _nama);
    }

    function setor(uint256 _jumlah) external {
        require(aktif, "Patungan tidak aktif");
        require(anggota[msg.sender].sudahDaftar, "Anggota belum daftar");

        anggota[msg.sender].jumlahBayar += _jumlah;
        totalTerkumpul += _jumlah;

        emit Setor(msg.sender, _jumlah);
    }
}
