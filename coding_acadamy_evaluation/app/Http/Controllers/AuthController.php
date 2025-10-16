<?php

// app/Http/Controllers/AuthController.php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ]);

        $user = User::create([
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        return response()->json(['message' => 'Utilisateur créé', 'user' => $user], 201);
    }

    public function login(Request $request)
    {
    $validated = $request->validate([
        'email' => 'required|email',
        'password' => 'required',
    ]);

    if (auth()->attempt($validated)) {
        $user = auth()->user();
        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['token' => $token], 200);
    }

    return response()->json(['message' => 'Identifiants invalides'], 401);
    }
}