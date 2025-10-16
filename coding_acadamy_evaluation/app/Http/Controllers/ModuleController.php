<?php


namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Module;
use Illuminate\Http\Request;

class ModuleController extends Controller
{
    public function toggleModule(Request $request, User $user, Module $module)
    {
        $validated = $request->validate([
            'is_active' => 'required|boolean',
        ]);

        $user->modules()->syncWithoutDetaching([$module->id => ['is_active' => $validated['is_active']]]);
        return response()->json(['message' => 'Module mis à jour']);
    }
}