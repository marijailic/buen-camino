<?php

namespace App\Services;

use Cloudinary\Api\Admin\AdminApi;
use Cloudinary\Api\Upload\UploadApi;
use Cloudinary\Configuration\Configuration;

class CloudinaryService
{
    public function storeImage(string $publicId, string $base64Image)
    {
        $cloudinaryKey = config('services.cloudinary.key');
        $cloudinarySecret = config('services.cloudinary.secret');
        $cloudinaryCloudName = config('services.cloudinary.cloud_name');

        Configuration::instance("cloudinary://{$cloudinaryKey}:{$cloudinarySecret}@{$cloudinaryCloudName}?secure=true");

        $upload = new UploadApi();

        return $upload->upload('data:image/png;base64,' . $base64Image, [
            'public_id' => $publicId,
            'use_filename' => true,
            'overwrite' => true
        ]);
    }

    public function getImageUrl($publicId)
    {
        $cloudinaryKey = config('services.cloudinary.key');
        $cloudinarySecret = config('services.cloudinary.secret');
        $cloudinaryCloudName = config('services.cloudinary.cloud_name');

        Configuration::instance("cloudinary://{$cloudinaryKey}:{$cloudinarySecret}@{$cloudinaryCloudName}?secure=true");

        return (new AdminApi())->asset($publicId, ['colors' => true])->getIterator()->offsetGet('secure_url');
    }
}
