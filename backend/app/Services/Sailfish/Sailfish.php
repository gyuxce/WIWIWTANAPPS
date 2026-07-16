<?php

namespace App\Services\Sailfish;

use App\Services\Sailfish\SailfishFetch;

class Sailfish
{

    use SailfishFetch;

    /**
     * @body
     * {
     *    "type": "string", // "email"
     *    "recipient": "string" // user email,
     *    "title": "string",
     *    "recipient_name": "string",
     *    "body": "only for testing",
     *    "template": "string" // template name that has been created in sailfish,
     *    "template_params": "object" // optional
     * }
     */
    public function push($body)
    {
        return $this->fetch('POST', '/notifications/push', $body);
    }

    public function getAll($query = [])
    {
        return $this->fetch('GET', '/notifications', [], '', $query);
    }

    public function get($id)
    {
        return $this->fetch('GET', '/notifications/' . $id);
    }

    /**
     * @body
     *  {
     *      "sender":0,
     *      "recipient":136,
     *      "title":"Selamat Datang Kawan!!!",
     *      "body":"Indahnya Indonesia sia-sia kalo ngga di manfaatin, ayo bersama kita majukan wisata Indonesia.",
     *      "category":"dari_kamu",
     *      "template":"email_complete_registration.html",
     *      "template_params": {
     *          "name":"Dimas",
     *          "url": "https://www.google.com"
     *      }
     *  }
     */
    public function create($body)
    {
        return $this->fetch('POST', '/notifications', $body);
    }

    /**
     * @body
     *  {
     *      "status": "read",
     *  }
     */
    public function update($id, $body)
    {
        return $this->fetch('PUT', '/notifications/' . $id, $body);
    }

    public function delete($id)
    {
        return $this->fetch('DELETE', '/notifications/' . $id);
    }

    public function fcmStore($body)
    {
        return $this->fetch('POST', '/token/push', $body);
    }

    public function sendNotificationFirebase($body)
    {
        return $this->fetch('POST', '/token/push-notifications', $body);
    }
}