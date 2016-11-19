<template>
  <div>
    <br />
    <form v-on:submit.prevent="SUBMIT_ENTRANCE_REQUEST($event.target)">
      <div class="row">
        <div class="column column-100">
          <div v-if="!room_id">
            <label for="r">Your desired room id ( 1op.eu/... )</label>
            <input name="roomIdField" id="r" type="text" placeholder="room id, eg. asdasdasd">
          </div>

          <label for="p">Your secret password (it will never be sent)</label>
          <input name="passwordField" id="p" type="password" placeholder="Enter your password..."/>

          <center>
            <input class="button-outline" type="submit">
          </center>
        </div>
      </div>
    </form>
    <h4>What the hell is this place?</h4>
    <p>
      1op is an encrypted chat application, where I try to solve couple of trust-related problems when it comes to current instant chat apps. Let's dive deeper into how this idea is structured...
    </p>
    <h5>Alright, so what's the big deal?</h5>
    <p>
      We can pretty much encrypt stuff using either symmetric or asymmetric algorithms. With symmetric encryption we only need key passphrase to encrypt/decrypt a message. It's all more complicated when it comes to asymmetric encryption algorithm, where we have a Private and a Public key. Using a Private key we can encrypt a message, which can be decrypted using only the Public one, and vice-versa (Public-key-encrypted messages can be decrypted using only the Private key). That's pretty much how the Internet identity trust is built. We trust that Google is Google, because it's identity is encrypted using some Key-Authority's Private Key (which is securely stored somewhere far away) and we all have it's Public key stored on our computers. We could use the same solution in instant messaging in order to indispose seeing our messages for everybody inbetween our computers (the Internet is huge after all).
    </p>
    <p>... but why shouldn't we?</p>
    <p>
      The Internet relies on certificates, which are signed by authorities, in which indentities we all trust. In order to gain that kind of signed-certificate we have to pay a price to the authority and we won't be doing this for a simple chatroom. The only solution we have is to generate our own certificates. But we have to transfer them somehow between computers, and that is where a rouge middleman can come in to interfere. It's very easy for the platform we use (a middleman) to fake secure connection when we rely only on an asymmetrical encryption protocol like RSA (the middleman can store our public key, generate it's own key-pair and encrypt every message using it's own key, and then resend a message encrypted by our own public key back to us). What's the solution I would like to offer?
    </p>
    <h5>Let's encrypt public keys using symmetric encryption!</h5>
    <p>
      There is a splendid symmetric encryption protocol called AES, which we can use to encrypt our public key before sending it to our chatroom friend. AES needs a passphrase. A password, which we can tell each other using other type of communication (e.g. mobile phone). That way, we can be sure that:
    </p>
    <ol>
      <li>No one inbetween our computers can read our messages in real-time (which would be impossible without signing asymmetrical key-pair or trusting a middleman)</li>

      <li>No one can ever decrypt our messages in future, even when they have all our web-traffic secured and know our initial passphrase (thanks to asymmetrical encryption)</li>
    </ol>

    <h5>Whoa! How exactly does it work?</h5>
    <p>
    First of all you save your plain password in a browser temporary website state (which will be cleared after a refresh, so don't do that). Then, you will send it's SHA-512 hashsum (one-way encryption) to the server in order to compare with other chatroom members. If you are the first one or previous guy had the same password-hashsum you will open a socket connection to the server and send your Public RSA key encrypted using AES using your password (stored temporarily in your browser). Every other chatroom client will receive your messaage and decrypt your RSA Public key using AES with the same password you got. From now on, you will receive messages encrypted on other clients' computers using your RSA Public key.
    </p>
    <h5>... but wait! How can i trust you?!</h5>
    <p>It's <a href="http://github.com/intpl/1op-elixir-vuejs" target="_blank">open source</a>, baby! You can read the code and set it up on your own if you are paranoid. :)</p>
    <em>Made with love by <a href="http://gladecki.pl" target="_blank">Bartek Gladecki</a></em>
  </div>
</template>

<script>
  import { mapActions, mapState } from 'vuex'

  export default {
    name: 'entrance',
    computed: mapState(['room_id']),
    methods: mapActions(['SUBMIT_ENTRANCE_REQUEST'])
  }
</script>

<style scoped></style>
