(() => {
  const projects = window.ARCHIVAL_DOSSIERS;
  const detail = document.getElementById('workDetail');

  if (!projects || !detail) {
    throw new Error('The project detail page could not be initialized.');
  }

  const selectedId = new URLSearchParams(window.location.search).get('look');
  const project = projects[selectedId];

  if (!project) {
    const notFound = document.createElement('section');
    notFound.className = 'project-not-found';

    const label = document.createElement('span');
    label.className = 'section-tag-red';
    label.textContent = 'PROJECT NOT FOUND';

    const heading = document.createElement('h1');
    heading.textContent = 'This atelier dossier is unavailable.';

    const backLink = document.createElement('a');
    backLink.className = 'project-back-link';
    backLink.href = 'index.html#works';
    backLink.textContent = '← BACK TO CLIENT FOLDERS';

    notFound.append(label, heading, backLink);
    detail.replaceChildren(notFound);
    return;
  }

  if (!Array.isArray(project.gallery) || project.gallery.length === 0) {
    throw new Error(`The gallery is missing for project "${selectedId}".`);
  }

  const projectCaptions = {
    'Denied Divinity': 'CREDITS : Abhinithi Madhan, Ranjith, Shivam Kumar, Dhikkshitha Jain, Swapna',
    Tide: 'CREDITS : Lakshmi, Jananu, Aathirai, Amallyah, Leelu, Vanaja, Valli, Ajay',
    'No lesser love': 'CREDITS : Abhinithi Madhan, Deekshitha Sivakumar, Vivek Gupta, Preetam, Anushka J Nair',
    'The Fully Filmy Shoot': 'CREDITS : Ram, Abhinithi Madhan, Deekshita Chowdary, Varnita, Rajdhir, Ashmit, Deekshita Siva Kumar, Trisha',
    'The Sirpi Shoot': 'CREDITS : Haritha Sanja abhinithi madhan rajith',
    'The Latha_puttana': 'CREDITS : photographer @pawansraj / @kaushik_padmasridhar Talent - @priya_ohani Creative Team @styled.byelis / @yumbayana / @anegalan / @trendsft.ar',
    'J-Queen': 'CREDITS : Art Direction/Creative Concept/Stylist @_anegalan_ Cinematography @mouli_frames Cinematography team @simbu.dp Mua - @Kiha_makeover Talent - J queen',
    'Tales from the bunny': 'CREDITS : Vivek Si,r Arnon, Abhinithi Madhan, Vijugowda',
    'Character deconstruction': 'CREDITS : Ashok, Abhinithi Madhan, Jayakrishna, Anushka',
    Futurism: 'CREDITS : Abia, Abhinithi Madhan, Vivek',
    'Rebel test shoot': 'CREDITS :  Abhinithi Madhan'
  };

  const header = document.createElement('header');
  header.className = 'project-gallery-header';

  const headingCopy = document.createElement('div');
  if (project.category) {
    const category = document.createElement('span');
    category.className = 'section-tag-red';
    category.textContent = project.category;
    headingCopy.append(category);
  }

  const title = document.createElement('h1');
  title.textContent = project.title;
  headingCopy.append(title);

  if (project.inspiration) {
    const summary = document.createElement('p');
    summary.textContent = project.inspiration;
    headingCopy.append(summary);
  }

  const backLink = document.createElement('a');
  backLink.className = 'project-gallery-back';
  backLink.href = 'index.html#works';
  backLink.textContent = '← BACK TO CLIENT FOLDERS';
  header.append(headingCopy, backLink);

  const gallery = document.createElement('section');
  gallery.setAttribute('aria-label', `${project.title} project gallery`);

  const createCard = (item, index, isDuplicate = false) => {
    const card = document.createElement('article');
    card.className = 'project-gallery-card';

    const imageButton = document.createElement('button');
    imageButton.className = 'project-gallery-image-button';
    imageButton.type = 'button';
    const description = projectCaptions[item.title] || '';
    imageButton.setAttribute('aria-label', `View full image: ${item.title}. ${description} ${item.caption}`);
    imageButton.dataset.fullImage = item.image;
    imageButton.dataset.imageAlt = item.title;
    imageButton.dataset.imageCaption = `${item.title} —\n${description}\n— (${item.caption})`;
    imageButton.tabIndex = isDuplicate ? -1 : 0;
    if (isDuplicate) imageButton.setAttribute('aria-hidden', 'true');

    const image = document.createElement('img');
    image.src = item.image.replace(/^assets\/images\//, 'assets/images/optimized/');
    image.alt = isDuplicate ? '' : item.title;
    image.loading = !isDuplicate && index < 3 ? 'eager' : 'lazy';
    if (!isDuplicate && index < 3) image.fetchPriority = 'high';
    imageButton.append(image);

    const caption = document.createElement('div');
    caption.className = 'project-gallery-card-caption';

    const imageTitle = document.createElement('h3');
    imageTitle.textContent = item.title;

    const imageDescription = document.createElement('p');
    imageDescription.className = 'project-caption-description';
    imageDescription.textContent = description;

    const imageNumber = document.createElement('p');
    imageNumber.className = 'project-frame-number';
    imageNumber.textContent = item.caption;
    caption.append(imageTitle, imageDescription, imageNumber);

    card.append(imageButton, caption);
    return card;
  };

  const shootGroups = new Map();
  project.gallery.forEach((item) => {
    if (!shootGroups.has(item.title)) shootGroups.set(item.title, []);
    shootGroups.get(item.title).push(item);
  });

  const isShootCollection = shootGroups.size > 0;
  gallery.className = isShootCollection ? 'project-shoot-galleries' : 'project-gallery-grid';

  if (isShootCollection) {
    const directions = {
      'Camp Shoot': 'right',
      'Fish Shoot': 'left',
      'Queer Shoot': 'right'
    };

    [...shootGroups.entries()].forEach(([groupTitle, items], groupIndex) => {
      const direction = directions[groupTitle] || (groupIndex % 2 === 0 ? 'left' : 'right');
      const row = document.createElement('section');
      row.className = `project-shoot-row project-shoot-row-${direction}`;
      row.setAttribute('aria-label', groupTitle);

      const rowHeading = document.createElement('h2');
      rowHeading.className = 'project-shoot-heading';
      rowHeading.textContent = groupTitle;

      const viewport = document.createElement('div');
      viewport.className = 'project-shoot-viewport';

      const track = document.createElement('div');
      track.className = 'project-shoot-track';

      for (let copyIndex = 0; copyIndex < 2; copyIndex += 1) {
        const set = document.createElement('div');
        set.className = 'project-shoot-set';
        set.setAttribute('aria-hidden', String(copyIndex > 0));
        items.forEach((item, itemIndex) => {
          set.append(createCard(item, itemIndex + groupIndex * 3, copyIndex > 0));
        });
        track.append(set);
      }

      viewport.append(track);
      row.append(rowHeading, viewport);
      gallery.append(row);
    });
  } else {
    project.gallery.forEach((item, index) => {
      gallery.append(createCard(item, index));
    });
  }

  const lightbox = document.createElement('dialog');
  lightbox.className = 'project-image-lightbox';
  lightbox.setAttribute('aria-label', 'Full-size project image');

  const lightboxImage = document.createElement('img');
  lightboxImage.className = 'project-image-lightbox-image';
  lightboxImage.alt = '';
  const lightboxCaption = document.createElement('p');
  lightboxCaption.className = 'project-image-lightbox-caption';
  const lightboxClose = document.createElement('button');
  lightboxClose.className = 'project-image-lightbox-close';
  lightboxClose.type = 'button';
  lightboxClose.setAttribute('aria-label', 'Close full-size image');
  lightboxClose.textContent = 'CLOSE ×';
  lightbox.append(lightboxImage, lightboxCaption, lightboxClose);
  let activeViewport = null;
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) lightbox.close();
  });
  lightbox.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') lightbox.close();
  });
  lightbox.addEventListener('close', () => {
    if (!activeViewport) return;
    const viewport = activeViewport;
    viewport.classList.add('is-paused');
    viewport.addEventListener('pointerleave', () => {
      viewport.classList.remove('is-paused');
    }, { once: true });
    activeViewport = null;
  });
  lightboxClose.addEventListener('click', () => lightbox.close());
  gallery.addEventListener('click', (event) => {
    const imageButton = event.target.closest('.project-gallery-image-button');
    if (!imageButton) return;
    activeViewport = imageButton.closest('.project-shoot-viewport');
    activeViewport?.classList.add('is-paused');
    lightboxImage.src = imageButton.dataset.fullImage;
    lightboxImage.alt = imageButton.dataset.imageAlt;
    lightboxCaption.textContent = imageButton.dataset.imageCaption;
    lightbox.showModal();
  });

  detail.replaceChildren(header, gallery, lightbox);
  document.title = `${project.title} — Abhinithi Madhan`;
})();
