# 📚 ezDin Front-end

## 🎯 Sobre o Projeto

O ezDin Front-end é a **interface do usuário** da aplicação web gamificada de finanças pessoais "ezDin". Ele proporciona uma experiência interativa e acessível para que jovens e adultos aprendam a controlar suas finanças, evitar dívidas e alcançar seus objetivos financeiros.

Este projeto é responsável por toda a **UI (User Interface)** e **UX (User Experience)** do aplicativo, consumindo as APIs desenvolvidas no [repositório do Back-end EzDin](https://github.com/diegoolinek/ezdin_backend). Nosso foco é apresentar a educação financeira de forma simples, prática e engajadora, utilizando elementos de gamificação como trilhas interativas, desafios e acompanhamento de progresso.

---

## ✨ Tecnologias Utilizadas

Este frontend foi construído com as seguintes tecnologias principais:

- **JavaScript**: Linguagem de programação.
- **React**: Biblioteca para construção de interfaces de usuário.
- **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
- **React Router Dom**: Para gerenciamento de rotas e navegação na aplicação.
- **Vite**: Ferramenta de build para desenvolvimento React.

---

## 🧪 Testando a Aplicação

- Para testar nosso webapp acesse a URL: ...

---

## 🤝 Colaboradores

Os seguintes desenvolvedores contribuíram para este projeto:

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/DoctorSolo" title="Perfil do Github">
        <img src="https://github.com/DoctorSolo.png" width="100px;" alt="Foto do Miguel Eduardo no GitHub"/><br>
        <sub>
          <b>Miguel Eduardo</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/koltee" title="Perfil do Github">
        <img src="https://github.com/koltee.png" width="100px;" alt="Foto do Eliseu Silva"/><br>
        <sub>
          <b>Eliseu Silva</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/NUBI400" title="Perfil do Github">
        <img src="https://github.com/NUBI400.png" width="100px;" alt="Foto do Lucas Figueiredo"/><br>
        <sub>
          <b>Lucas Figueiredo</b>
        </sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/diegoolinek" title="Perfil do Github">
        <img src="https://github.com/diegoolinek.png" width="100px;" alt="Foto do Diego Olinek no GitHub"/><br>
        <sub>
          <b>Diego Olinek</b>
        </sub>
      </a>
    </td>
  </tr>
</table>

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

---

(Projeto desenvolvido para a primeira maratona de programação da [BeroLab](https://www.berolab.app/))

## Como editar o conteúdo da plataforma (Admin)

1. **Acesse o painel de administração:**

   - Vá para a rota `/admin` no navegador (ex: `http://localhost:3000/admin`).

2. **Edite módulos, aulas, explicações e questões:**

   - Use os botões para adicionar, editar ou remover módulos e aulas.
   - Dentro de cada aula, é possível editar explicações e questões.

3. **Salve as alterações:**

   - Após fazer mudanças, clique no botão **Salvar** no topo da página.
   - O conteúdo será salvo localmente no navegador (localStorage).

4. **Mudanças refletem em toda a plataforma:**

   - Todas as páginas da plataforma (aulas, trilha, barra lateral, etc.) passam a usar o conteúdo salvo no admin automaticamente.
   - Não é necessário editar arquivos manualmente nem recarregar o servidor.

5. **Observações:**
   - O conteúdo salvo é local para cada navegador/usuário. Para compartilhar com todos, é necessário implementar um backend/API.
   - Para restaurar o conteúdo original, limpe o localStorage do navegador.

Se tiver dúvidas, consulte este README ou pergunte ao responsável pelo front-end.
