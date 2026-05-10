// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

// import {Test, console} from "forge-std/Test.sol";
// import {Patungan} from "../src/Patungan.sol";

// // RUN
// // forge test --match-contract PatunganTest -vvv
// contract PatunganTest is Test {
//     Patungan public patungan;

//     address public alice = makeAddr("alice"); // bendahara

//     address public bob = makeAddr("bob");
//     address public carol = makeAddr("carol");
//     address public denis = makeAddr("denis");

//     address public owner = makeAddr("owner");

//     function setUp() public {
//         // function yang pertama kali di execute saat test dijalankan
//         // address(patungan) -> address(0)
//         console.log("alice", alice);
//         console.log("=============");
//         console.log("address(patungan) before", address(patungan));

//         vm.startPrank(owner);
//         patungan = new Patungan(); // contract deployed -> address
//         vm.stopPrank();

//         console.log("=============");
//         console.log("address(patungan) after", address(patungan));
//         //address(patungan) -> address(0x1234567890123456789012345678901234567890)
//     }

//     // RUN
//     // forge test --match-contract PatunganTest --match-test test_SetBendahara -vvv
//     function test_SetBendahara() public {
//         vm.startPrank(owner);
//         patungan.setBendahara(alice);
//         vm.stopPrank();

//         assertEq(patungan.bendahara(), alice);
//     }

//     function test_SetAktif() public {
//         test_SetBendahara();
//         vm.startPrank(alice);
//         patungan.setAktif(true);
//         assertEq(patungan.aktif(), true);
//         vm.stopPrank();
//     }

//     function test_SetTargetTotal() public {
//         test_SetBendahara();
//         vm.startPrank(alice);
//         patungan.setTargetTotal(1000);
//         vm.stopPrank();
//     }

//     function test_Daftar() public {
//         vm.startPrank(bob);
//         patungan.daftar("Bob");
//         vm.stopPrank();

//         vm.startPrank(carol);
//         patungan.daftar("Carol");
//         vm.stopPrank();

//         vm.startPrank(denis);
//         patungan.daftar("Denis");
//         vm.stopPrank();
//     }

//     function test_Setor() public {
//         test_SetAktif();
//         test_Daftar();
//         vm.startPrank(bob);
//         patungan.setor(100);
//         vm.stopPrank();
//     }

//     function test_readArray() public {
//         test_Daftar();
//         console.log("array[0]");
//         console.log("daftarAnggota[0]", patungan.daftarAnggota(0));
//         console.log("daftarAnggota[1]", patungan.daftarAnggota(1));
//         console.log("daftarAnggota[2]", patungan.daftarAnggota(2));
//     }
// }
