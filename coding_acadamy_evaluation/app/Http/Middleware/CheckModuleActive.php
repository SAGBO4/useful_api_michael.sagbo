<?php

namespace App\Http\Middleware;
use Closure;
use Illuminate\Http\Request;
use App\Models\Module;

class CheckModuleActive
{
    public function handle(Request $request, Closure $next, $moduleName)
    {
        $user = auth()->user();
        $module = Module::where('name', $moduleName)->first();

        if (!$module || !$user->modules()->where('module_id', $module->id)->wherePivot('is_active', true)->exists()) {
            return response()->json(['message' => 'Accès non autorisé à ce module'], 403);
        }

        return $next($request);
    }
}
