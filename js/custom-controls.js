/**
 * @constructor
 */
function CustomControl(onClickListener, iconName, title) {
  // Set CSS for the control border.
  var container = document.createElement('div');
  container.index = 1;

  var controlUI = document.createElement('div');
  controlUI.style.backgroundColor = '#fff';
  controlUI.style.border = '2px solid #fff';
  controlUI.style.borderRadius = '3px';
  controlUI.style.boxShadow = '0 2px 6px rgba(0,0,0,.3)';
  controlUI.style.cursor = 'pointer';
  controlUI.style.textAlign = 'center';
  controlUI.title = title;
  container.appendChild(controlUI);

  // Set CSS for the control interior.
  var control = document.createElement('i');
  control.className = 'material-icons md-dark';
  control.innerHTML = iconName;
  controlUI.appendChild(control);
  container.addEventListener('click', onClickListener);

  return container;
}