const NewPage = () => {
  return (
    <main className="prose">
      <h1>Create a new app</h1>
      <p>
        Follow these instructions to setup AuthPortal for your Firebase project.
      </p>

      <h2>Copy the firebase app configuration:</h2>
      <p>
        Open your Firebase{" "}
        <a href="https://console.firebase.google.com/project/_/settings/general">
          project general settings
        </a>
        . Under the &quot;Your Apps&quot; section, select one of your Web apps
        and copy the initialization code here:
      </p>
      <textarea
        placeholder="const firebaseConfig = { ..."
        style={{ width: 600, height: 300 }}
      ></textarea>
    </main>
  );
};

export default NewPage;
