<?php

namespace App\Http\Controllers;

use App\Models\ShortUrl;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ShortUrlController extends Controller
{
    // Crée un lien court
    public function create(Request $request)
    {
        $validated = $request->validate([
            'original_url' => 'required|url',
        ]);

        // Génére un code unique (6 caractères)
        $shortCode = Str::random(6);
        while (ShortUrl::where('short_code', $shortCode)->exists()) {
            $shortCode = Str::random(6); // S'assurer que le code est unique
        }

        $shortUrl = ShortUrl::create([
            'user_id' => auth()->id(),
            'original_url' => $validated['original_url'],
            'short_code' => $shortCode,
        ]);

        return response()->json([
            'short_url' => url($shortCode),
            'original_url' => $shortUrl->original_url,
        ], 201);
    }

    // Redirige vers l'URL originale
    public function redirect($shortCode)
    {
        $shortUrl = ShortUrl::where('short_code', $shortCode)->firstOrFail();

        // Incrémente le compteur de clics
        $shortUrl->increment('clicks');

        return redirect()->away($shortUrl->original_url);
    }

    // Obtiens les statistiques
    public function stats($shortCode)
    {
        $shortUrl = ShortUrl::where('short_code', $shortCode)
            ->where('user_id', auth()->id())
            ->firstOrFail();

        return response()->json([
            'short_url' => url($shortUrl->short_code),
            'original_url' => $shortUrl->original_url,
            'clicks' => $shortUrl->clicks,
            'created_at' => $shortUrl->created_at,
        ]);
    }
}
